import { Behavior, ChartMetadata, ChartPlugin, t } from '@superset-ui/core';
import buildQuery from 'src/filters/components/Select/buildQuery';
import controlPanel from 'src/filters/components/Select/controlPanel';
import transformProps from 'src/filters/components/Select/transformProps';
import thumbnail from 'src/filters/components//Select/images/thumbnail.png';

export default class KatalonSelectFilterPlugin extends ChartPlugin {
  constructor() {
    const metadata = new ChartMetadata({
      name: t('Katalon Select filter'),
      description: t('Select filter plugin using mui'),
      behaviors: [Behavior.INTERACTIVE_CHART, Behavior.NATIVE_FILTER],
      enableNoResults: false,
      tags: [t('Experimental')],
      thumbnail,
    });

    super({
      buildQuery,
      controlPanel,
      loadChart: () => import('./KatalonSelectFilterPlugin'),
      metadata,
      transformProps,
    });
  }
}
