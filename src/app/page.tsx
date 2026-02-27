import { getDonationProgress, getDonationGoal } from "@/lib/db-donations";
import { fetchPrayerTimes, getNextPrayer } from "@/lib/prayer-times";
import { getHomeLayout } from "@/lib/db-settings";
import HomeV1 from "@/components/HomeV1";
import HomeV2 from "@/components/HomeV2";

export default async function HomePage() {
  const currentAmount = await getDonationProgress();
  const goalAmount = await getDonationGoal();
  const percentage = Math.min(Math.round((currentAmount / goalAmount) * 100), 100);
  const remaining = Math.max(goalAmount - currentAmount, 0);

  const progress = {
    currentAmount,
    goalAmount,
    percentage,
    remaining,
    lastUpdated: new Date().toISOString(),
  };

  const prayerTimes = await fetchPrayerTimes();
  const nextPrayer = prayerTimes ? getNextPrayer(prayerTimes) : null;
  const layout = await getHomeLayout();

  const props = { progress, prayerTimes, nextPrayer };

  return layout === "v1" ? <HomeV1 {...props} /> : <HomeV2 {...props} />;
}
