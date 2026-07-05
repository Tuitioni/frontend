'use client';

import React, { useState, ChangeEvent, FormEvent } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface FormData {
  name: string;
  email: string;
  message: string;
}

const Contact: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setSubmitted(false);
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitted(true);
    setFormData({ name: '', email: '', message: '' });
  };

  return (
    <div className="relative overflow-hidden bg-mesh">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 md:py-24 lg:grid-cols-2">
        {/* Intro */}
        <div className="space-y-6">
          <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-primary">
            <span className="h-2 w-2 rounded-full bg-amber" />
            Get in touch
          </span>
          <h1 className="text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-5xl">
            We&apos;re here to help.
            <br />
            <span className="text-gradient">Let&apos;s talk.</span>
          </h1>
          <p className="max-w-xl text-lg text-muted-foreground">
            Questions about finding a tutor, becoming one, or anything else? Send us a message and
            the Tuitioni team will get back to you soon.
          </p>

          <dl className="space-y-4 pt-2">
            <div className="flex items-center gap-3">
              <span
                className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-800 text-lg text-white"
                aria-hidden="true"
              >
                ✉️
              </span>
              <div className="leading-tight">
                <dt className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Email us
                </dt>
                <dd className="font-display text-base font-bold">support@tuitioni.com</dd>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span
                className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br from-amber-300 to-amber-500 text-lg text-[#3A2A05]"
                aria-hidden="true"
              >
                💬
              </span>
              <div className="leading-tight">
                <dt className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Response time
                </dt>
                <dd className="font-display text-base font-bold">Usually within 24 hours</dd>
              </div>
            </div>
          </dl>
        </div>

        {/* Form card */}
        <div className="rounded-2xl border border-border bg-card p-8 shadow-float">
          <h2 className="font-display text-2xl font-bold tracking-tight">Contact us</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Fill in the form below and we&apos;ll be in touch.
          </p>

          {submitted && (
            <div
              role="status"
              className="mt-6 rounded-xl border border-success/20 bg-success/10 px-4 py-3 text-sm font-medium text-success"
            >
              Thank you for your query. We will get back to you soon.
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-6 space-y-5">
            <div className="space-y-1.5">
              <Label htmlFor="name">Name</Label>
              <Input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="message">Message</Label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows={4}
                className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              ></textarea>
            </div>
            <Button
              type="submit"
              size="lg"
              className="w-full rounded-pill font-semibold shadow-glow"
            >
              Send message
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;
