import ProfilePage from "./ProfilePage";
import KedarPhoto from "../Kedar.jpeg";
import * as DE from "../data/dataEngineer";

export default function DataEngineerPage() {
  return <ProfilePage profileKey="de" photoSrc={KedarPhoto} {...DE} />;
}
