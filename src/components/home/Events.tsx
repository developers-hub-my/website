import Photo from './Photo';
import { container, h2 } from './styles';

// Events DevHub took part in. Captions say where we were and nothing more:
// no claims about the organisers, the guests or what the event achieved.
const Events = () => (
  <section aria-labelledby="events-title" className="py-20 sm:py-28">
    <div className={container}>
      <h2 id="events-title" className={`max-w-3xl ${h2}`}>
        Out at events in 2026
      </h2>
      <p className="mt-4 max-w-2xl text-lg leading-relaxed text-slate-800 dark:text-slate-200">
        We meet students, universities and industry where they gather.
      </p>

      <div className="mt-12 grid md:grid-cols-2 gap-8">
        <figure>
          <Photo
            name="iec-2026-launch"
            widths={[480, 810]}
            width={810}
            height={540}
            sizes="(min-width: 1280px) 592px, (min-width: 768px) 48vw, 100vw"
            alt="The opening ceremony on stage at IEC 2026, under the event's large illuminated logo."
            className="w-full aspect-3/2 object-cover rounded-xl bg-slate-100 dark:bg-slate-800"
          />
          <figcaption className="mt-3 font-semibold text-slate-900 dark:text-white">DevHub at IEC 2026</figcaption>
        </figure>
        <figure>
          <Photo
            name="fai-utm-2026-booth"
            widths={[480, 960]}
            width={1280}
            height={960}
            sizes="(min-width: 1280px) 592px, (min-width: 768px) 48vw, 100vw"
            alt="DevHub engineers talk with students across the DevHub booth table, with the DevHub banner behind them."
            className="w-full aspect-3/2 object-cover rounded-xl bg-slate-100 dark:bg-slate-800"
          />
          <figcaption className="mt-3 font-semibold text-slate-900 dark:text-white">
            DevHub at a university industry engagement day, 2026
          </figcaption>
        </figure>
      </div>
    </div>
  </section>
);

export default Events;
