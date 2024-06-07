import { SafeAreaView } from 'react-native-safe-area-context'
import TimeTrackComp from '../../../components/TimeTrack'
import { View, Text } from 'react-native'

const monthlyView = () => {
  return (<>
    <SafeAreaView className="bg-primary-lighter">
    <View className="flex items-center bg-primary-lighter">
        <Text className="text-2xl font-bold mb-5 text-center border-b border-gray-300 pb-2 w-[75%]">
          Time Track
        </Text>
      </View>
      <TimeTrackComp />
    </SafeAreaView>
  </>
  )
}

export default monthlyView