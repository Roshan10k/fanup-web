const contactItems = [
  {
    title: "Email Us",
    value: "support@fanup.com",
    tone: "bg-red-100 text-red-500",
    path: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
      />
    ),
  },
  {
    title: "Call Us",
    value: "+01-123-456",
    tone: "bg-blue-100 text-blue-500",
    path: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
      />
    ),
  },
  {
    title: "Visit Us",
    value: "Kathmandu, Nepal",
    tone: "bg-amber-100 text-amber-600",
    path: (
      <>
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
        />
      </>
    ),
  },
];

export default function ContactSection() {
  return (
    <section id="contact" className="section-shell relative py-22">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-14 text-center">
          <p className="mb-4 text-xs font-semibold tracking-[0.2em] text-red-500 uppercase">Contact</p>
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">Get In Touch</h2>
          <p className="mx-auto mt-4 max-w-2xl text-base text-gray-600 sm:text-lg">
            Need support or partnership details? Reach out and our team will respond quickly.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          <div className="premium-card rounded-3xl p-7 sm:p-8">
            <h3 className="text-2xl font-semibold text-gray-900">Contact Details</h3>
            <p className="mt-2 text-sm text-gray-600">Prefer direct communication? Use any channel below.</p>

            <div className="mt-8 space-y-6">
              {contactItems.map((item) => (
                <div key={item.title} className="flex items-start gap-4">
                  <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${item.tone}`}>
                    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      {item.path}
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900">{item.title}</h4>
                    <p className="text-gray-600">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <form className="premium-card rounded-3xl p-7 sm:p-8">
            <h3 className="text-2xl font-semibold text-gray-900">Send a Message</h3>
            <p className="mt-2 text-sm text-gray-600">We usually reply within 24 hours.</p>

            <div className="mt-8 space-y-5">
              <input
                type="text"
                name="name"
                placeholder="Your Name"
                className="w-full rounded-2xl border border-gray-200 bg-white px-5 py-3.5 text-sm text-gray-900 shadow-sm outline-none transition focus:border-red-400 focus:ring-2 focus:ring-red-100"
              />
              <input
                type="email"
                name="email"
                placeholder="Your Email"
                className="w-full rounded-2xl border border-gray-200 bg-white px-5 py-3.5 text-sm text-gray-900 shadow-sm outline-none transition focus:border-red-400 focus:ring-2 focus:ring-red-100"
              />
              <textarea
                name="message"
                placeholder="Your Message"
                rows={5}
                className="w-full resize-none rounded-2xl border border-gray-200 bg-white px-5 py-3.5 text-sm text-gray-900 shadow-sm outline-none transition focus:border-red-400 focus:ring-2 focus:ring-red-100"
              />
              <button
                type="submit"
                className="w-full rounded-2xl bg-gradient-to-r from-red-500 to-rose-600 py-3.5 text-sm font-semibold text-white shadow-lg shadow-red-500/30 transition hover:from-red-600 hover:to-rose-700"
              >
                Send Message
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
