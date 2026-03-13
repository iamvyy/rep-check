import { useExercises } from '@/features/workout/hooks/use-exercises';
import { Exercise } from '@/features/workout/types/exercise';
import { useCallback } from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
} from 'react-native';

export const ExerciseList = () => {
  const { data, isLoading, isRefetching, refetch } = useExercises({
    limit: 5,
    offset: 0,
  });

  // TODO - Enahcne the ui
  const renderItem = useCallback(
    ({ item }: { item: Exercise }) => (
      <View style={styles.item}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.details}>{item.bodyParts}</Text>
      </View>
    ),
    [],
  );

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#000" />
        <Text>Loading Exercises...</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={data?.data}
      keyExtractor={(item) => item.exerciseId.toString()}
      renderItem={renderItem}
      onRefresh={refetch}
      refreshing={isRefetching}
      contentContainerStyle={styles.listContent}
      ListEmptyComponent={<Text>No exercises found.</Text>}
    />
  );
};

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    padding: 16,
  },
  item: {
    padding: 16,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#eee',
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  details: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
});
