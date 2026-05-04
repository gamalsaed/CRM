import { usePathname, useRouter } from "@/i18n/navigation";

export default function useLanguage() {
  // Hooks
  const router = useRouter();
  const pathname = usePathname();

  // Function
  const changeLanguage = (locale: string) => {
    const segments = pathname.split("/");
    segments[1] = locale;

    router.replace(segments.join("/"));
  };

  return changeLanguage;
}
