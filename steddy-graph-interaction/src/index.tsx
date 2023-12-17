import { View, Text, StyleSheet, useWindowDimensions } from 'react-native';
import {
  LIGHT_GRAPH_SCORES,
  PRO_GRAPH_SCORES,
  STANRDARD_GRAPH_SCORES,
} from './constants/graph-scores';
import { useMemo, useState } from 'react';
import { Palette } from './constants/palette';
import { StatusBar } from 'expo-status-bar';
import { SegmentedControl } from './components/segmented-control';
import { Graph } from './components/graph';

// Define an array of scoring difficulties and their types
const ScoringDifficultyData = ['Light', 'Standard', 'Pro'] as const;
type ScoringDifficultyType = (typeof ScoringDifficultyData)[number];

// Map scoring difficulties to their respective score data
const ScoringMap = {
  Light: LIGHT_GRAPH_SCORES,
  Standard: STANRDARD_GRAPH_SCORES,
  Pro: PRO_GRAPH_SCORES,
};

const App = () => {
  const [scoringDifficulty, setSelectedScoringDifficulty] =
    useState<ScoringDifficultyType>('Standard');

  // Get the window width using React Native's useWindowDimensions
  const { width: windowWidth } = useWindowDimensions();

  // Calculate scores based on the selected difficulty
  const scores = useMemo(() => {
    return ScoringMap[scoringDifficulty];
  }, [scoringDifficulty]);

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      {/* SegmentedControl component for selecting scoring difficulty */}
      <SegmentedControl
        data={ScoringDifficultyData}
        onPress={(item) => {
          setSelectedScoringDifficulty(item as ScoringDifficultyType);
        }}
        width={windowWidth - 30}
        height={56}
        selected={scoringDifficulty}
      />

      {/* Graph component to display the scores */}
      <Graph
        scores={scores}
        style={{ marginTop: 20 }}
        canvasHeight={200}
        canvasWidth={windowWidth}
        padding={50}
        maxValue={100}
        lineScore={70}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Palette.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export { App };
