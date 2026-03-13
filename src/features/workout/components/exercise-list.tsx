import { useTheme } from '@/features/theme/hooks/use-theme';
import { useInfiniteExercises } from '@/features/workout/hooks/use-exercises';
import { Exercise } from '@/features/workout/types/exercise';
import { Image } from 'expo-image';
import { useCallback, useMemo } from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
} from 'react-native';

export const ExerciseList = () => {
  const { colors, isDark } = useTheme();

  const {
    data,
    isLoading,
    isRefetching,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteExercises({
    limit: 10,
  });

  const exercises = useMemo(() => {
    return data?.pages.flatMap((page) => page.data) ?? [];
  }, [data]);

  const renderItem = useCallback(
    ({ item }: { item: Exercise }) => (
      <View
        style={[
          styles.item,
          { backgroundColor: colors.surface, borderColor: colors.borderSubtle },
        ]}
      >
        <Image
          source={{ uri: item.gifUrl }}
          style={[
            styles.image,
            { backgroundColor: isDark ? colors.surfaceSecondary : '#f5f5f5' },
          ]}
          contentFit="cover"
          transition={200}
          cachePolicy="memory-disk"
        />
        <View style={styles.itemInfo}>
          <Text
            style={[styles.name, { color: colors.textPrimary }]}
            numberOfLines={1}
          >
            {item.name}
          </Text>
          <Text
            style={[styles.details, { color: colors.textSecondary }]}
            numberOfLines={1}
          >
            {item.bodyParts.join(', ')} • {item.targetMuscles.join(', ')}
          </Text>
        </View>
      </View>
    ),
    [colors, isDark],
  );

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={colors.textPrimary} />
        <Text style={{ color: colors.textSecondary }}>Loading Exercises...</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={exercises}
      keyExtractor={(item, index) => `${item.exerciseId}-${index}`}
      renderItem={renderItem}
      onRefresh={refetch}
      refreshing={isRefetching && !isFetchingNextPage}
      onEndReached={() => {
        if (hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      }}
      onEndReachedThreshold={0.5}
      contentContainerStyle={styles.listContent}
      ListEmptyComponent={
        <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
          No exercises found.
        </Text>
      }
      ListFooterComponent={
        isFetchingNextPage ? (
          <View style={styles.footerLoader}>
            <ActivityIndicator size="small" color={colors.textPrimary} />
          </View>
        ) : null
      }
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
    paddingBottom: 40,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    gap: 16,
  },
  image: {
    width: 64,
    height: 64,
    borderRadius: 12,
  },
  itemInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  name: {
    fontSize: 16,
    fontWeight: '700',
    textTransform: 'capitalize',
  },
  details: {
    fontSize: 13,
    marginTop: 4,
    textTransform: 'capitalize',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
  },
  footerLoader: {
    paddingVertical: 16,
    alignItems: 'center',
  },
});
