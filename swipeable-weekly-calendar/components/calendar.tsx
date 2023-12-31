import React, { FC, useState, useMemo, useCallback, memo, useRef, LegacyRef } from 'react';

import { Header } from './header';
import { WeekItem } from './weekItem';
import { View, FlatList, unstable_batchedUpdates, Text, StyleSheet } from 'react-native';
import { format } from 'date-fns';
import { CalendarProps, ScrollEvent } from '../lib/types';
import {
  createLocalWeek,
  createNextTwoWeeks,
  createPreviousTwoWeeks,
  createWholeWeek,
  createWholeWeeks,
  formatDate,
  getLocalizedYearAndMonth,
} from '../lib/functions';
import { colors, itemWidht, screenWidth, styles } from '../lib/constants';
import create = StyleSheet.create;
import { ja } from 'date-fns/locale';

export const CalendarComponent: FC<CalendarProps> = memo(
  ({ date, language, onPressDate, selectedColor, showMonth, shadow }) => {
    const showHeader = showMonth ?? true;
    const [selectedDate, setSelectedDate] = useState(date);
    // to get current page's month
    const [appearDate, setAppearDate] = useState(date);
    const flatListRef: LegacyRef<any> = useRef<FlatList>();
    const getWholeWeek = useCallback(createWholeWeek, [createWholeWeek]);
    const wholeWeek = useMemo(() => {
      return getWholeWeek(selectedDate);
    }, [selectedDate, getWholeWeek]);
    const getWholeWeeks = useCallback(createWholeWeeks, [createWholeWeeks]);
    const wholeWeeks = useMemo(() => {
      return getWholeWeeks(selectedDate, wholeWeek);
    }, [selectedDate, wholeWeek]);

    const selectDate = useCallback(
      (d: Date) => {
        onPressDate(d);
      },
      [onPressDate]
    );

    const [weeks, setWeeks] = useState(wholeWeeks);

    const endReach = useCallback(() => {
      const n = createNextTwoWeeks(weeks.slice(-1)[0], []);
      setWeeks((w) => {
        return [...w, ...n];
      });
    }, [weeks, createNextTwoWeeks, setWeeks]);

    const addPreviousWeeks = () => {
      const newWeeks = createPreviousTwoWeeks(weeks[0], []);
      unstable_batchedUpdates(() => {
        setWeeks((currentWeeks) => [...newWeeks, ...currentWeeks]);
        flatListRef.current.scrollToIndex({ animated: false, index: ADDITIONAL_WEEKS_INDEX });
      });
    };

    const updateAppearDate = (widthFromStart: number, event: ScrollEvent) => {
      const currentPage = widthFromStart / event.nativeEvent.layoutMeasurement.width;
      setAppearDate(weeks[currentPage * 7 + 6]);
    };

    const momentumEnd = useCallback(
      (event: ScrollEvent) => {
        const widthFromStart = event.nativeEvent.contentOffset.x;

        // スクロール位置に基づいて週を追加
        if (widthFromStart < screenWidth) {
          addPreviousWeeks();
        }

        // 表示される日付の更新
        updateAppearDate(widthFromStart, event);
      },
      [createPreviousTwoWeeks, weeks, setWeeks, flatListRef, setAppearDate]
    );

    const localYear = useMemo(() => {
      const { year, month } = getLocalizedYearAndMonth(appearDate, language);
      return `${year}${month}`;
    }, [appearDate, language]);

    const localMonth = useMemo(() => {
      return format(appearDate, 'LLLL', { locale: createLocalWeek(language) });
    }, [createLocalWeek, appearDate]);

    return (
      <View
        style={
          shadow
            ? {
                backgroundColor: colors.white,
                paddingTop: 5,
                paddingBottom: 10,
                ...styles.shadow,
              }
            : {
                backgroundColor: colors.white,
                paddingTop: 5,
                paddingBottom: 10,
              }
        }
      >
        {showHeader && (
          <>
            <View style={{ alignSelf: 'center', paddingVertical: 10 }}>
              <Text style={{ fontSize: 18 }}>{localYear}</Text>
            </View>
          </>
        )}
        <Header language={language} />
        <FlatList
          ref={flatListRef}
          data={weeks}
          extraData={selectedDate}
          initialScrollIndex={14}
          horizontal
          pagingEnabled
          bounces
          showsHorizontalScrollIndicator={false}
          onEndReached={endReach}
          onEndReachedThreshold={0.01}
          onMomentumScrollEnd={momentumEnd}
          getItemLayout={(_, index) => ({
            length: itemWidht,
            offset: itemWidht * index,
            index,
          })}
          renderItem={({ item }) => {
            return (
              <WeekItem
                date={item}
                selectedDate={formatDate(item) === formatDate(date)}
                onSelectDate={selectDate}
                selectedColor={selectedColor}
                key={item.toDateString()}
              />
            );
          }}
        />
      </View>
    );
  }
);

const ADDITIONAL_WEEKS_INDEX = 14;
