import { Capability, Log, a, K8s } from "pepr";

export const HelloPeprSoak = new Capability({
  name: "hello-pepr-soak",
  description: "soak test",
  namespaces: ["pepr-demo"],
});

const { When } = HelloPeprSoak;

let i = 0;
const ackSecret = async (name: string) => {
  await K8s(a.Secret).Apply({
    metadata: {
      name: `${name}-seen`,
      namespace: "pepr-demo",
    },
    data: {
      a: Buffer.from("a").toString("base64"),
    },
  });
};
When(a.ConfigMap)
  .IsCreatedOrUpdated()
  .InNamespace("pepr-demo")
  .Reconcile(async instance => {
    if (instance.metadata?.name !== "kube-root-ca.crt") {
      return new Promise(resolve => {
        const timeOut = i++ % 2 == 0 ? 20000 : 5000;
        setTimeout(async () => {
          Log.info(
            `Callback: Reconciling ${instance.metadata.name} after ${
              timeOut / 1000
            }s`,
          );
          await ackSecret(instance.metadata.name);
          resolve();
        }, timeOut);
      });
    }
  });
