import ProfilePage from "./ProfilePage";
import KedarPhoto from "../Kedar.jpeg";
import * as DS from "../data/dataScientist";

export default function DataScientistPage() {
  return <ProfilePage profileKey="ds" photoSrc={KedarPhoto} {...DS} />;
}
