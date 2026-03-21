import { Title } from "@solidjs/meta";
import { Header, Footer} from "~/components/Layout";
import { Page } from "~/components/Page";

export default function About() {
  return (
    <main>
    <Header/>
      <Title>Qiara | Config</Title>
      <Page name="Config" description="View Global Qiara Protocol Config Parameters & Allowed Functions to be executed and more..." header="Vaults" content={<div class="panel"><div class="border"></div><div class="border"></div></div>}></Page>
    <Footer/>
    </main>
  );
}
