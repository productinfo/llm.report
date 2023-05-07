import { useDialog } from "@/components/SettingsModal";
import { LOCAL_STORAGE_KEY } from "@/lib/constants";
import useLocalStorage from "@/lib/use-local-storage";
import { Badge, Card, Flex, Text, Title } from "@tremor/react";
import axios from "axios";
import { NextPageContext } from "next";
import { getSession, useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";

const Settings = () => {
  const [key, setKey] = useLocalStorage<string>(LOCAL_STORAGE_KEY);
  const [validKey, setValidKey] = useState(false);
  const { openDialog } = useDialog();
  const { data: session } = useSession();

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    // save to local storage
    setKey(value);
  };

  useEffect(() => {
    const ping = async (): Promise<boolean> => {
      try {
        const res = await axios.get(
          "https://api.openai.com/dashboard/billing/subscription",
          {
            headers: {
              Authorization: `Bearer ${key}`,
            },
          }
        );
        setValidKey(true);
        return true;
      } catch (e) {
        setValidKey(false);
        return false;
      }
    };

    (async () => {
      await ping();
    })();
  }, [key]);

  return (
    <div className="max-w-[800px] space-y-4">
      <Flex className="xl:flex-row flex-col items-start xl:items-center space-y-4">
        <div className="space-y-2">
          <div className="flex flex-row space-x-3">
            <Title>Settings</Title>
          </div>
          <Text>
            Change your settings below. You can also change your API key here.
          </Text>
        </div>
      </Flex>

      <Card className="shadow-none">
        {/* <div className="flex flex-col">
          <div className="flex flex-row justify-between">
            <Text className="text-xl">Open AI Api Key</Text>
          </div>
        </div> */}

        <form
          onSubmit={(e) => e.preventDefault()}
          // className="space-y-5 mt-12 lg:pb-12 text-left"
        >
          <div>
            <div className="flex flex-row">
              <label className="font-medium text-gray-500">
                OpenAI API Key
              </label>

              <div className="ml-2">
                {!key && (
                  <Badge
                    className="px-3 space-x-2 cursor-pointer hover:scale-110 transition-all transform duration-200 ease-in-out"
                    onClick={() => openDialog()}
                    color="red"
                    icon={() => (
                      <span className="relative flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                      </span>
                    )}
                  >
                    waiting for key
                  </Badge>
                )}

                {session?.user && key && validKey && (
                  <Badge
                    className="px-3 space-x-2 cursor-pointer hover:scale-110 transition-all transform duration-200 ease-in-out"
                    onClick={() => openDialog()}
                    color="green"
                    icon={() => (
                      <span className="relative flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                      </span>
                    )}
                  >
                    live
                  </Badge>
                )}

                {session?.user && key && !validKey && (
                  <Badge
                    className="px-3 space-x-2 cursor-pointer hover:scale-110 transition-all transform duration-200 ease-in-out"
                    onClick={() => openDialog()}
                    color="red"
                    icon={() => (
                      <span className="relative flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                      </span>
                    )}
                  >
                    invalid key
                  </Badge>
                )}
              </div>
            </div>
            <input
              type="text"
              name={LOCAL_STORAGE_KEY}
              onChange={onChange}
              required
              value={key as string}
              className="w-full my-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-gray-800 shadow-sm rounded-lg selection:bg-gray-300 focus:bg-white autofill:bg-white"
              placeholder="sk-5q293fh..."
            />

            <p className="text-sm text-gray-500  mt-1 inline-block">
              Find API Key{" "}
              <Link
                href="https://beta.openai.com/account/api-keys"
                target="_blank"
                rel="noopener noreferrer"
                className="underline"
              >
                here.
              </Link>
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Note: The initial load may take up to 30 seconds.
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Note: We use your API key to generate the dashboard. API key is
              stored locally.
            </p>
          </div>
        </form>
      </Card>
    </div>
  );
};

export async function getServerSideProps(context: NextPageContext) {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }
  return { props: {} };
}

export default Settings;