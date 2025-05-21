import { Options } from "$fresh/plugins/twind.ts";
import { Configuration } from "twind";

export default {
  ...({
    theme: {
      extend: {
        fontFamily: {
          serif: ['var(--font-family)'],
        },
        colors: {
          backgroundColor: 'var(--background-color)',
          activeColor: '#000',
          white: '#EEE',
        },
      },
    },
    preflight: {
      body: {
        fontFamily: 'var(--font-family)',
        backgroundColor: 'var(--background-color)',
      },
    },
    plugins: {
      'link': 'text-activeColor hover:underline',
      'menu-link': 'text-lg',
      'index-image': 'h-[80vh] w-full object-cover mb-2',
      'scrollbar-hide': {
        '-ms-overflow-style': 'none',
        'scrollbar-width': 'none',
        '&::-webkit-scrollbar': {
          display: 'none'
        }
      },
    },
  } as Configuration),
  selfURL: import.meta.url,
} as Options;
