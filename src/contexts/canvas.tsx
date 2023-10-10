import { createContext, useEffect, useState } from 'react';
import { v4 as uuid } from 'uuid';

import { events, config } from 'app';
import { Sections, CanvasSection, Events } from 'types';

import { deepChangeObjectProperty } from 'utils';
import { usePersistedState } from 'hooks';

type HandleAddSectionArgs = CustomEvent<Sections>;
type HandleEditSectionArgs = CustomEvent<{
  id?: string;
  path: string;
  value: unknown;
}>;

type CanvasContextData = {
  sections: CanvasSection[];
  currentSection?: CanvasSection;
  previewMode: boolean;
};

type CanvasProviderProps = {
  children: React.ReactNode;
};

const CanvasContext = createContext<CanvasContextData>({} as CanvasContextData);

const CanvasProvider = ({ children }: CanvasProviderProps) => {
  const [sections, setSections] = usePersistedState<CanvasSection[]>(
    'canvas.sections',
    []
  );

  const [currentSection, setCurrentSection] = useState<CanvasSection>();
  const [previewTemplate, setPreviewTemplate] = useState<CanvasSection[]>([]);

  const handleAddSection = (event: HandleAddSectionArgs) => {
    const sectionType = event.detail;
    const defaultProps = config.sections.default[sectionType];

    const newSection = {
      id: uuid(),
      type: event.detail,
      ...defaultProps,
    };

    setSections(state => [...state, newSection]);
  };

  const handleEditSection = (event: HandleEditSectionArgs) => {
    const { id = currentSection?.id, path, value } = event.detail;

    if (!id) return;

    const obj = sections.find(item => item.id === id)!;

    const result = deepChangeObjectProperty<CanvasSection>({
      obj,
      path,
      value,
    });

    setSections(state =>
      state.map(item => {
        if (item.id === id) return result;
        return item;
      })
    );

    const isEditingCurrentSection = currentSection?.id === id;

    isEditingCurrentSection && setCurrentSection(result);
  };

  const handleRemoveSection = (event: CustomEvent<string>) => {
    setSections(state => state.filter(item => item.id !== event.detail));
  };

  const handleSetCurrentSection = (event: CustomEvent<string>) => {
    const id = event.detail;

    const result = sections.find(item => item.id === id);

    events.panel.open('right', result!.type);
    setCurrentSection(result);
  };

  const handleReorderSections = (event: CustomEvent<string[]>) => {
    const order = event.detail;

    const sectionsReorded = order.map(
      sectionId => sections.find(section => section.id === sectionId)!
    );

    setSections(sectionsReorded);
  };

  const handleDuplicateSection = (event: CustomEvent<string>) => {
    const id = event.detail;

    const newSections = sections.reduce((arr, section) => {
      if (section.id === id) {
        const duplicate = {
          ...section,
          id: uuid(),
        };

        return [...arr, section, duplicate];
      }

      return [...arr, section];
    }, [] as CanvasSection[]);

    setSections(newSections);
  };

  const handleUseTemplate = () => {
    setSections(previewTemplate);
    setPreviewTemplate([]);
  };

  const handlePreviewTemplate = (event: CustomEvent<CanvasSection[]>) => {
    const template = event.detail.map(section => ({ ...section, id: uuid() }));

    setPreviewTemplate(template);
  };

  const handleClearCanvas = () => setSections([]);

  useEffect(() => {
    // Canvas events

    events.on(Events.CANVAS_ADD_SECTION, handleAddSection);
    events.on(Events.CANVAS_EDIT_SECTION, handleEditSection);
    events.on(Events.CANVAS_REMOVE_SECTION, handleRemoveSection);
    events.on(Events.CANVAS_SET_CURRENT_SECTION, handleSetCurrentSection);
    events.on(Events.CANVAS_REORDER_SECTIONS, handleReorderSections);
    events.on(Events.CANVAS_DUPLICATE_SECTION, handleDuplicateSection);
    events.on(Events.CANVAS_CLEAR_SECTIONS, handleClearCanvas);

    return () => {
      events.off(Events.CANVAS_ADD_SECTION, handleAddSection);
      events.off(Events.CANVAS_EDIT_SECTION, handleEditSection);
      events.off(Events.CANVAS_REMOVE_SECTION, handleRemoveSection);
      events.off(Events.CANVAS_SET_CURRENT_SECTION, handleSetCurrentSection);
      events.off(Events.CANVAS_REORDER_SECTIONS, handleReorderSections);
      events.off(Events.CANVAS_DUPLICATE_SECTION, handleDuplicateSection);
      events.off(Events.CANVAS_CLEAR_SECTIONS, handleClearCanvas);
    };
  }, [sections, currentSection]);

  useEffect(() => {
    // Template events

    events.on(Events.TEMPLATE_USE, handleUseTemplate);
    events.on(Events.TEMPLATE_PREVIEW, handlePreviewTemplate);

    return () => {
      events.off(Events.TEMPLATE_USE, handleUseTemplate);
      events.off(Events.TEMPLATE_PREVIEW, handlePreviewTemplate);
    };
  }, [previewTemplate]);

  const previewMode = !!previewTemplate.length;
  const canvas = previewMode ? previewTemplate : sections;

  return (
    <CanvasContext.Provider
      value={{ sections: canvas, currentSection, previewMode }}
    >
      {children}
    </CanvasContext.Provider>
  );
};

export { CanvasContext, CanvasProvider };
