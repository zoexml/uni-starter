export default {
  generator: [
    {
      input: './openapi.json',
      output: 'src/apis/generated',
      type: 'ts',
      plugins: [
        {
          name: 'use-project-alova',
          beforeFileWrite({ content, fileName }) {
            if (fileName === 'index.ts') {
              return 'export { http as alovaInstance } from \'@/utils/http\'\n'
            }
            return content
          },
        },
      ],
    },
  ],
}
