import React from 'react';

const About: React.FC = () => {
  return (
    <div className="w-full">
      <div className="mb-16 md:mb-24">
        <h1 className="text-4xl md:text-6xl font-medium mb-8">About</h1>
        <div className="max-w-3xl space-y-6 text-lg leading-relaxed opacity-90 font-light italic">
          <p>
            I’m a London-based designer from Ecuador.
          </p>
          <p>
            In my creative practice, I mainly focus on urban narratives and revealing unseen details from our surroundings while experimenting with different media.
            Apart from developing my personal projects, I have also worked in various design fields since 2011: large-scale art installations at Loop.pH; exhibition design and tutoring/lecturing at the Royal College of Art; and at ROLI doing product, spatial & retail design projects since 2013 & most recently UI/UX design on the LUMI app.
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;
