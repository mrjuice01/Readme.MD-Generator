import { useEffect, useRef } from 'react';

import { events } from 'app';
import { DefaultContextMenuProps } from '../base';

import { actions } from './actions';
import * as S from './styles';

type SectionContextMenuProps = DefaultContextMenuProps;

const SectionContextMenu = ({ event }: SectionContextMenuProps) => {
  const sectionIdRef = useRef<string>();

  const canShow = () => {
    const range = 5;

    let sectionId = '';
    let currentElement = event.target as HTMLElement;
    let currentIndex = 0;

    while (!sectionId && currentIndex < range) {
      sectionId = currentElement.getAttribute('data-sectionid') || '';
      if (!sectionId && currentElement.parentElement) {
        currentElement = currentElement.parentElement;
      }
      currentIndex += 1;
    }

    if (sectionId) sectionIdRef.current = sectionId;
    else events.contextmenu.close();
  };

  useEffect(() => {
    canShow();
  }, [event]);

  return (
    <S.Container>
      {actions.map(({ label, icon: Icon, action, ...rest }) => (
        <S.Action
          key={label}
          onClick={() => [
            action(sectionIdRef.current!),
            events.contextmenu.close(),
          ]}
          {...rest}
        >
          {label}

          <S.WrapperIcon>
            <Icon size={16} />
          </S.WrapperIcon>
        </S.Action>
      ))}
    </S.Container>
  );
};

export { SectionContextMenu };
