import { Icons } from "@/components/icons";

const icons = [
  Icons.ycombinator,
  Icons.openaiLogo,
  Icons.googleLogo,
  Icons.lyft,
  Icons.microsoft,
];

export const TrustedBy = () => {
  return (
    <section>
      <div className="py-14">
        <div className="max-w-screen-xl mx-auto px-4 md:px-8">
          <h3 className="font-semibold text-sm text-gray-600 text-center">
            TRUSTED BY THE BEST TEAMS FROM AROUND THE WORLD
          </h3>
          <div className="mt-6">
            <ul className="gap-x-10 gap-y-6 md:gap-x-12 grid grid-cols-2 md:grid-cols-5 place-content-center">
              {icons.map((Icon, i) => (
                <li key={i}>
                  <Icon className="w-30 mx-auto" />
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};
