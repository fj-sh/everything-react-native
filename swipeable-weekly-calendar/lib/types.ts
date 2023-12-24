import { NativeSyntheticEvent, NativeScrollEvent } from 'react-native';
export interface CalendarProps extends DefaultProps, CalendarHeaderProps {}

export type WeekItemProps = Pick<DefaultProps, 'date'> & {
  selectedDate: boolean;
  onSelectDate: (d: Date) => void;
  selectedColor?: string;
};

export type DefaultProps = {
  date: Date;
  selectedColor?: string;
  onPressDate: (d: Date) => void;
  showMonth?: boolean;
  shadow?: boolean;
};

export type CalendarHeaderProps = {
  language?: Language;
};

export type Language = 'ja' | 'en' | 'ko' | 'es';

export type ScrollEvent = NativeSyntheticEvent<NativeScrollEvent>;
