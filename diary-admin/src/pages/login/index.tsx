import Head from "next/head";
import { Form, Button } from "antd";

export default function Login() {
  return (
    <>
      <Head>
        <title>登录</title>
        <meta name="description" content="游记审核系统" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <Form.Item>
          <Button
            type="primary"
          >
            Log in
          </Button>
        </Form.Item>
      </main>
    </>
  );
}