const Testimonial = () => {
  return (
    <section className="py-32">
      <div className="container">
        <div className="flex flex-col items-center gap-6 border-y py-14 text-center md:py-20">
          <q className="block max-w-4xl text-2xl font-medium lg:text-3xl">
            Having an AI Xano developer is a game changer. What used to take
            hours of documentation reading and trial-and-error now happens in
            minutes. It's like having a senior Xano developer on the team 24/7.
          </q>
          <div className="flex flex-col items-center gap-2 sm:flex-row">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://api.dicebear.com/7.x/shapes/svg?seed=TechCorpLogo"
              alt="TechCorp"
              className="h-7"
            />
            <p className="font-medium">Sarah Chen, CTO at TechCorp Solutions</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export { Testimonial };
