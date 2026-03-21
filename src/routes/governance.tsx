import { Title } from "@solidjs/meta";
import { Header, Footer} from "~/components/Layout";
import { Page } from "~/components/Page";

export default function About() {
  return (
    <main>
    <Header/>
      <Title>Qiara | Governance</Title>
      <Page name="Governance" description="Vote on Active Proposals, see Past Proposals, and more... The First and Only true mature Decentralized Autonomous Protocol" header="Vaults" content={<div class="panel"><div class="border"></div><div class="border"></div></div>}></Page>
    <Footer/>
    </main>
  );
}
