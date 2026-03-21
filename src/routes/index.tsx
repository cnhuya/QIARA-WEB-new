import { Title } from "@solidjs/meta";
import { Header, Footer} from "~/components/Layout";

export default function Home() {
  return (
    <main>
      <Header  />
      <Title>Hello World</Title>
      <h1>Hello world!</h1>
      <p>
        Visit{" "}
        <a href="https://start.solidjs.com" target="_blank">
          start.solidjs.com
        </a>{" "}
        to learn how to build SolidStart apps.
      </p>
      <Footer />
    </main>
  );
}
