import VerifyEmail from "@/components/VerifyEmail";
import Image from "next/image";

interface searchParamsProp {
  searchParams: {
    [key: string]: string | string[] | undefined;
  };
}

const VerifyEmailPage = ({ searchParams }: searchParamsProp) => {
  const token = searchParams.token;
  console.log(typeof token);
  const toEmail = searchParams.to;
  return (
    <div className="container relative flex flex-col items-center justify-center pt-20 lg:px-0 ">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 md:max-w-[350px] ">
        {token && typeof token === "string" ? (
          <div className="grid gap-6">
            <VerifyEmail token={token} />
          </div>
        ) : (
          <div className="flex flex-col h-full items-center justify-center space-y-1">
            <div className="relative mb-4 h-60 w-60 text-muted-foreground">
              <Image src="/hippo-email-sent.png" fill alt="sent email HIPPO" />
            </div>

            <h3 className="font-semibold text-2xl">Check your email</h3>
            {toEmail ? (
              <p className="text-muted-foreground text-center">
                We&apos;ve sent a verification link to{" "}
                <span className="font-semibold">{toEmail}</span>
              </p>
            ) : (
              <p className="text-muted-foreground text-center">
                We&apos;ve sent a verification link to your Email
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default VerifyEmailPage;
