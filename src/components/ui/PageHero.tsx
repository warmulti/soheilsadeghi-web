import Vinyl from "@/components/Vinyl";
import { Kicker } from "./SectionHeading";

type Props = {
  kicker?: string | null;
  title: string;
  accent?: string | null;
  lead?: string | null;
  children?: React.ReactNode;
};

/** Inner-page hero: headline at the start side, a slowly spinning vinyl bleeding off the end edge. */
export default function PageHero({ kicker, title, accent, lead, children }: Props) {
  return (
    <section className="relative overflow-hidden px-5 pt-32 pb-14 md:px-8 md:pt-44 md:pb-20">
      <div
        className="pointer-events-none absolute end-0 top-1/2 w-[min(88vw,640px)] -translate-y-1/2 opacity-25 ltr:translate-x-[42%] rtl:-translate-x-[42%] lg:opacity-60 lg:ltr:translate-x-[16%] lg:rtl:-translate-x-[16%]"
        aria-hidden="true"
      >
        <div data-reveal>
          <Vinyl showArm={false} />
        </div>
      </div>

      <div className="relative mx-auto max-w-7xl">
        <div className="max-w-3xl">
          <div data-reveal>
            <Kicker>{kicker}</Kicker>
          </div>
          <h1 data-reveal className="mt-4 text-4xl font-black leading-[1.3] text-white md:text-6xl">
            {title}
            {accent && (
              <>
                {" "}
                <span className="text-gradient">{accent}</span>
              </>
            )}
          </h1>
          {lead && (
            <p data-reveal className="mt-6 max-w-2xl text-lg leading-9 text-white/65">
              {lead}
            </p>
          )}
          {children && (
            <div data-reveal className="mt-9">
              {children}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
