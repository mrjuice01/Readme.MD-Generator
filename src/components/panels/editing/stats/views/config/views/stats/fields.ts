import {
  customTitleField,
  showField,
  localeField,
  themeField,
} from '../@shared';
import { Inputs } from 'types';

const groups = [
  {
    id: 1,
    fields: [
      showField('stats'),
      customTitleField('stats'),
      localeField('stats'),
    ],
  },
  {
    id: 2,
    label: 'Layout',
    columns: 2,
    fields: [
      {
        type: Inputs.SWITCH,
        path: 'content.graphs.stats.show_icons',
        label: 'Show icons',
        props: {
          direction: 'column',
        },
      },
      {
        type: Inputs.SWITCH,
        path: 'content.graphs.stats.hide_rank',
        label: 'Hide rank',
        props: {
          direction: 'column',
        },
      },
      {
        type: Inputs.SWITCH,
        path: 'content.graphs.stats.hide_title',
        label: 'Hide title',
        props: {
          direction: 'column',
        },
      },
      {
        type: Inputs.SWITCH,
        path: `content.graphs.stats.hide_border`,
        label: 'Hide border',
        props: {
          direction: 'column',
        },
      },
      {
        type: Inputs.SWITCH,
        path: 'content.graphs.stats.disable_animations',
        label: 'Disable animations',
        props: {
          direction: 'column',
        },
      },
      {
        type: Inputs.TEXT,
        path: 'content.graphs.stats.height',
        label: 'Height',
        props: {
          type: 'number',
          min: 0,
        },
      },
      themeField('stats'),
    ],
  },
  {
    id: 4,
    label: 'Commits',
    fields: [
      {
        type: Inputs.SWITCH,
        path: 'content.graphs.stats.include_all_commits',
        label: 'Include all the time',
        props: {},
      },
      {
        type: Inputs.SWITCH,
        path: 'content.graphs.stats.count_private',
        label: 'Include privates',
        props: {},
      },
    ],
  },
];

export { groups };
