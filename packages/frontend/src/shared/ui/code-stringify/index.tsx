import { FC, memo } from 'react';



interface Props {
  obj: any
}

export const CodeStringify: FC<Props> = memo(({ obj }) => (
  <pre><code>{JSON.stringify(obj, null, 2)}</code></pre>
));
