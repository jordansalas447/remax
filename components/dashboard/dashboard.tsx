import { DASHBOARD_WIDGETS } from "./widgets";

export default function Dashboard() {
  return (
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {DASHBOARD_WIDGETS.map(({ id, Component }) => (
        <Component key={id} />
      ))}
    </section>
  );
}

