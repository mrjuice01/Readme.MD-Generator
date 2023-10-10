import React, { useEffect, useState } from 'react';
import Router from 'next/router';

import { Tabs } from 'components';
import { tabs, views } from './tabs';

import * as S from './styles';

type Views = keyof typeof views;

const StatsEditPanel = () => {
  const [currentTab, setCurrentTab] = useState<Views>('layout');

  const View = views[currentTab] ?? React.Fragment;

  useEffect(() => {
    return () => {
      const query = new URLSearchParams(window.location.search);

      query.delete('tab');
      query.delete('stats-tab');

      Router.replace(
        {
          pathname: window.location.pathname,
          query: query.toString(),
        },
        undefined,
        {
          shallow: true,
        }
      );
    };
  }, []);

  return (
    <S.Container>
      <Tabs tabs={tabs} setCurrentTab={setCurrentTab} currentTab={currentTab} />

      <View />
    </S.Container>
  );
};

export { StatsEditPanel };
