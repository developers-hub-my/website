import { Link } from 'react-router';
import { ArrowRight } from 'lucide-react';
import Photo from './Photo';
import { container, h2, textLink } from './styles';

const SMALL = [
  {
    name: 'students-coding',
    alt: 'Students work through an exercise on their laptops at a DevHub workshop table.',
  },
  {
    name: 'team-at-work',
    alt: 'A full workshop room, each table with laptops open and a slide on the screen at the front.',
  },
] as const;

const People = () => (
  <section aria-labelledby="people-title" className="bg-slate-50 dark:bg-slate-900 py-20 sm:py-28">
    <div className={container}>
      <div className="grid lg:grid-cols-12 gap-6 items-end">
        <h2 id="people-title" className={`lg:col-span-6 ${h2}`}>
          Training that stays with your team
        </h2>
        <div className="lg:col-span-6">
          <p className="text-lg leading-relaxed text-slate-800 dark:text-slate-200">
            Hands-on training, bootcamps, coaching and mentoring by DevHub engineers. With
            universities, we run final-year projects and internships.
          </p>
          <Link to="/trainings/" className={`mt-4 ${textLink}`}>
            See the trainings
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </Link>
        </div>
      </div>

      <div className="mt-12 grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        <Photo
          name="mentoring-table"
          widths={[480, 960]}
          width={1600}
          height={901}
          sizes="(min-width: 1024px) 66vw, 100vw"
          alt="A DevHub mentor stands beside a table of students, helping with the code on their screens."
          frameClassName="col-span-2 lg:row-span-2"
          className="w-full h-full object-cover rounded-xl bg-slate-200 dark:bg-slate-800"
        />
        {SMALL.map((photo) => (
          <Photo
            key={photo.name}
            name={photo.name}
            widths={[480, 960]}
            width={1600}
            height={901}
            sizes="(min-width: 1024px) 33vw, 50vw"
            alt={photo.alt}
            className="w-full h-auto rounded-xl bg-slate-200 dark:bg-slate-800"
          />
        ))}
      </div>
    </div>
  </section>
);

export default People;
