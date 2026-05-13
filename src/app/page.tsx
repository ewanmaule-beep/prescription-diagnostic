"use client";

import { useRouter } from "next/navigation";
import Layout from "@/components/Layout";
import Button from "@/components/Button";

export default function Home() {
  const router = useRouter();

  return (
    <Layout maxWidth="md">
      {/* Hero */}
      <div className="mb-14">
        <div className="mb-6">
          <span
            className="inline-block text-xs font-medium tracking-widest uppercase mb-6"
            style={{ color: "var(--teal)" }}
          >
            The Prescription
          </span>
        </div>

        <h1
          className="font-serif text-4xl sm:text-5xl font-normal leading-tight mb-5"
          style={{ color: "var(--text)" }}
        >
          Career Translation
          <br />
          <span style={{ color: "var(--teal)" }}>Diagnostic</span>
        </h1>

        <p
          className="text-lg sm:text-xl font-light leading-relaxed mb-8"
          style={{ color: "var(--text-muted)" }}
        >
          For NHS professionals who know they have valuable experience, but cannot yet
          see where else it might fit.
        </p>

        <Button onClick={() => router.push("/diagnostic")} className="text-base px-8 py-4">
          Start the diagnostic
        </Button>
      </div>

      {/* Divider */}
      <div
        className="h-px w-16 mb-12"
        style={{ background: "var(--border)" }}
      />

      {/* Intro copy */}
      <div className="mb-12">
        <p className="text-base leading-relaxed mb-4" style={{ color: "var(--text-muted)" }}>
          After years inside the NHS, it is easy to describe yourself by your job title,
          band, profession, or organisation.
        </p>
        <p className="text-base leading-relaxed mb-4" style={{ color: "var(--text-muted)" }}>
          This diagnostic helps you look underneath that. It identifies the capabilities,
          working patterns, and environments that may transfer beyond the NHS — so you
          can have a more honest conversation about what you are actually good at and
          where that might take you next.
        </p>
        <p className="text-base leading-relaxed" style={{ color: "var(--text-muted)" }}>
          It takes around twelve to fifteen minutes. Answer as you are now, not as you
          think you should be.
        </p>
      </div>

      {/* Reassurance cards */}
      <div className="grid sm:grid-cols-3 gap-4 mb-12">
        {[
          {
            icon: "○",
            title: "Not a personality test",
            body: "There are no types here. You will not be told you are an INTJ or a Challenger.",
          },
          {
            icon: "○",
            title: "Not a job list",
            body: "It will not tell you what job to take. It helps you see your own patterns more clearly.",
          },
          {
            icon: "○",
            title: "A starting point",
            body: "Use this to prompt your own reflection, or as preparation for a coaching conversation.",
          },
        ].map((item) => (
          <div key={item.title} className="card p-5">
            <p
              className="font-serif text-2xl mb-3"
              style={{ color: "var(--teal)", opacity: 0.4 }}
            >
              {item.icon}
            </p>
            <h3
              className="font-medium text-sm mb-2"
              style={{ color: "var(--text)" }}
            >
              {item.title}
            </h3>
            <p className="text-sm leading-relaxed" style={{ color: "var(--text-subtle)" }}>
              {item.body}
            </p>
          </div>
        ))}
      </div>

      {/* How it works */}
      <div className="card p-6 sm:p-8 mb-10">
        <h2
          className="font-serif text-xl font-normal mb-5"
          style={{ color: "var(--text)" }}
        >
          How it works
        </h2>
        <div className="space-y-4">
          {[
            {
              step: "1",
              text: "Twenty questions across six areas — complexity, ambiguity, influence, delivery, values, and energy.",
            },
            {
              step: "2",
              text: "A mix of multiple choice, rating scales, and short free-text answers. None of the text answers are required.",
            },
            {
              step: "3",
              text: "A report showing your patterns, likely environments, possible sectors, and coaching questions to take into your next conversation.",
            },
          ].map((item) => (
            <div key={item.step} className="flex gap-4">
              <span
                className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-sm font-medium text-white"
                style={{ background: "var(--teal)" }}
              >
                {item.step}
              </span>
              <p className="text-sm leading-relaxed pt-0.5" style={{ color: "var(--text-muted)" }}>
                {item.text}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="text-center">
        <Button onClick={() => router.push("/diagnostic")} className="text-base px-8 py-4">
          Begin
        </Button>
        <p className="text-xs mt-4" style={{ color: "var(--text-subtle)" }}>
          No account needed. Your answers are not stored.
        </p>
      </div>
    </Layout>
  );
}
