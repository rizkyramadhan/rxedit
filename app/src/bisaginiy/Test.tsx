import React from "react";
import { View, Text } from "react-xp";
import { observer } from "mobx-react-lite";

export default observer(() => {
  return (
    <View style={{ width: 100 }} mabok={{ asik: "" }}>
      <Text>Halo</Text>
    </View>
  );
});
