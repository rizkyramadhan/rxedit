import React from "react";
import SplitPane from 'react-split-pane';
import 'react-splitter-layout/lib/index.css';
import { observer } from "mobx-react-lite";

export default observer(() => {
    return  <SplitPane>
        <div>Pane 1</div>
        <div>Pane 2</div>
    </SplitPane>
})