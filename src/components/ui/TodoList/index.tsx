import { useState, useMemo } from 'react';
import useTodos from '@/utils/firebase-v9/firebase/firestore/useTodos';
import { FormControl, RadioGroup, Paper, TodoDiv } from './styled';
import Grid from '@mui/material/Grid';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import TextField from '@mui/material/TextField';
import Checkbox from '@mui/material/Checkbox';
import Button from '@mui/material/Button';
import Radio from '@mui/material/Radio';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Collapse from '@mui/material/Collapse';
import { TransitionGroup } from 'react-transition-group';
import LinearProgress from '@mui/material/LinearProgress';
import CloseIcon from '@mui/icons-material/Close';

const TodoList = () => {
  const [filter, setFilter] = useState<string>('all');

  const fsTodo = useTodos();

  const filtedTodo = useMemo(() => {
    if (filter === 'all') return fsTodo.todos;
    else if (filter === 'completed') return fsTodo.todos?.filter((todo) => todo.completed);
    else return fsTodo.todos?.filter((todo) => !todo.completed);
  }, [filter, fsTodo.todos]) as Todo[];

  const handleAddTodo = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const name = event.currentTarget.addTodo.value.trim();
    event.currentTarget.addTodo.value = '';

    if (name) {
      const newTodo = { name, completed: false, createAt: new Date() };
      fsTodo.add(newTodo);
    }
  };

  const handleSetTodo = (action: string, todo: Partial<Omit<Todo, 'createAt'>> & Required<{ id: string }>) => {
    if (action === 'UPDATE') {
      const { id, ...rest } = todo;
      fsTodo.update(id, rest);
    } else if (action === 'DELETE') {
      fsTodo.delete(todo.id);
    }
  };

  return (
    <form onSubmit={handleAddTodo}>
      <Grid container spacing={1} alignItems="center">
        <Grid xs={12} sm={12} md={10} item>
          <TextField type="addTodo" variant="outlined" name="addTodo" fullWidth size="small" placeholder="Type ..." />
        </Grid>
        <Grid xs={12} sm={12} md={2} item>
          <Button type="submit" variant="contained" fullWidth>
            Add
          </Button>
        </Grid>
      </Grid>
      <Filter filter={filter} setFilter={setFilter} />
      {fsTodo.loading ? <LinearProgress /> : null}
      <Paper>
        {filtedTodo?.length > 0 ? (
          <TransitionGroup>
            {filtedTodo?.map((todo) => (
              <Collapse key={todo.id}>
                <TodoItem todo={todo} setTodo={handleSetTodo} />
              </Collapse>
            ))}
          </TransitionGroup>
        ) : (
          <TodoDiv>No Todo...</TodoDiv>
        )}
      </Paper>
    </form>
  );
};

export default TodoList;

interface TodoItemProps {
  todo: Todo;
  setTodo: (action: string, todo: Partial<Omit<Todo, 'createAt'>> & Required<{ id: string }>) => void;
}
const TodoItem = ({ todo, setTodo }: TodoItemProps) => {
  // marked completed and delete methods here
  const handleToggleCompleted = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    setTodo('UPDATE', { id: todo.id, completed: event.target.checked });
  };

  const handleDelete = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.preventDefault();
    setTodo('DELETE', { id: todo.id });
  };

  return (
    <TodoDiv>
      <Checkbox checked={todo?.completed} onChange={handleToggleCompleted} />
      <Typography sx={{ textDecoration: todo?.completed ? 'line-through' : '' }}>{todo?.name}</Typography>
      <IconButton onClick={handleDelete}>
        <CloseIcon fontSize="medium" />
      </IconButton>
    </TodoDiv>
  );
};

const Filter = ({ filter, setFilter }: { filter: string; setFilter: (update: React.SetStateAction<string>) => void }) => {
  return (
    <FormControl>
      <FormLabel>Status</FormLabel>
      <RadioGroup onChange={(e) => setFilter(e.target.value)} value={filter}>
        <FormControlLabel value="all" control={<Radio />} label="All" />
        <FormControlLabel value="completed" control={<Radio />} label="Completed" />
        <FormControlLabel value="incompleted" control={<Radio />} label="Incompleted" />
      </RadioGroup>
    </FormControl>
  );
};
