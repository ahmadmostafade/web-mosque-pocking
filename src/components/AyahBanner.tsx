import Link from "next/link";

interface Props {
  showButton?: boolean;
}

export default function AyahBanner({ showButton = true }: Props) {
  return (
    <div className="text-center bg-mosque-green-50 rounded-xl p-8">
      <p className="text-2xl text-mosque-green-800 font-arabic mb-4 leading-loose" dir="rtl">
        مَّن ذَا ٱلَّذِى يُقْرِضُ ٱللَّهَ قَرْضًا حَسَنًا فَيُضَـٰعِفَهُۥ لَهُۥٓ أَضْعَافًا كَثِيرَةً
      </p>
      <p className="text-gray-600 italic mb-6">
        „Wer ist es, der Allah ein gutes Darlehen gibt, damit Er es ihm vervielfache?" – Sure Al-Baqara, 245
      </p>
      <p className="text-gray-700 mb-8">
        Jede Spende, egal wie klein, bringt uns dem Ziel näher.
      </p>
      {showButton && (
        <Link
          href="/spenden"
          className="inline-block bg-mosque-green-600 text-white font-bold px-8 py-3 rounded-xl hover:bg-mosque-green-700 transition-colors"
        >
          Jetzt spenden
        </Link>
      )}
    </div>
  );
}
