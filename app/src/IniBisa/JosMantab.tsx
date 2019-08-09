import config from "@app/backend";
import global from "@app/global";
import getSession from "@app/libs/gql/session/getSession";
import login from "@app/libs/gql/session/login";
import UIBody from "@app/libs/ui/UIBody";
import UIButton from "@app/libs/ui/UIButton";
import UICard from "@app/libs/ui/UICard";
import UICol from "@app/libs/ui/UICol";
import UIContainer from "@app/libs/ui/UIContainer";
import UILoading from "@app/libs/ui/UILoading";
import UIRow from "@app/libs/ui/UIRow";
import UIText from "@app/libs/ui/UIText";
import UITextField from "@app/libs/ui/UITextField";
import React, { useEffect, useState } from "react";
import { RouteComponentProps, withRouter } from "react-router";
import { Alert } from "reactxp";

const LoginForm = withRouter(({ history }: RouteComponentProps) => {
  const [username, setUsername] = useState("coba");
  const [password, setPassword] = useState("123");
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    (async () => {
      const session = await getSession();
      global.setSession(session);
      if (!global.session.uid) {
        global.setSession(false);
      } else {
        history.replace("/");
      }
    })();
  }, []);

  return (
    <UICol size={4} xs={12} sm={12}>
      <UICard style={{ padding: 25 }}>
        <UIText
          size="extralarge"
          style={{ paddingTop: 50, textAlign: "center" }}
        >
          Login Page
        </UIText>
        <UIText
          style={{ paddingTop: 10, paddingBottom: 20, textAlign: "center" }}
        >
          Silakan login sesuai dengan user di {config.url}
        </UIText>
        <UITextField
          label="Username"
          type="text"
          value={username}
          setValue={value => {
            setUsername(value);
          }}
        />

        <UITextField
          label="Password"
          type="password"
          value={password}
          setValue={value => {
            setPassword(value);
          }}
        />
        <UIRow>
          {loading ? (
            <UILoading />
          ) : (
            <UIButton
              onPress={async () => {
                setLoading(true);
                const res = await login(username, password);
                if (!res) {
                  Alert.show("Gagal Login");
                  setLoading(false);
                } else {
                  setLoading(false);
                  global.setSession(res);
                  history.replace("/");
                  // global.setSidebar(isSize(['md', 'lg']));
                }
              }}
            >
              Login
            </UIButton>
          )}
        </UIRow>
      </UICard>
    </UICol>
  );
});

export default () => {
  return (
    <UIContainer>
      <UIBody
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        <UIRow
          style={{
            width: "100%"
          }}
        >
          <UICol size={4} xs={0} sm={0} />
          <LoginForm />
          <UICol size={4} xs={0} sm={0} />
        </UIRow>
      </UIBody>
    </UIContainer>
  );
};
