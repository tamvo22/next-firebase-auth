import { forwardRef } from 'react';
import NextLink from 'next/link';
import { Link as MuiLink } from '@mui/material';

const Link = forwardRef((props: any, ref: any) => {
  const { href } = props;
  return (
    <NextLink href={href} passHref>
      <MuiLink ref={ref} {...props} />
    </NextLink>
  );
});

Link.displayName = 'CustomLink';

export default Link;
