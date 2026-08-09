import Studio from "@/components/Studio";
import { TutorialProvider } from "@/components/TutorialProvider";

export default function Page() {
  return (
    <TutorialProvider>
      <Studio />
    </TutorialProvider>
  );
}
