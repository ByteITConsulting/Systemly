import { IconType } from "react-icons";
import {
  FaUserAlt,
  FaCloud,
  FaProjectDiagram,
  FaNetworkWired,
  FaLock,
  FaGlobe,
  FaServer,
  FaMicrochip,
  FaInbox,
  FaBolt,
  FaDatabase,
  FaHdd,
  FaQuestion,
} from "react-icons/fa";

const ICON_MAP: Record<string, IconType> = {
  client: FaUserAlt,
  cdn: FaCloud,
  "load-balancer": FaProjectDiagram,
  "api-gateway": FaNetworkWired,
  auth: FaLock,
  "web-server": FaGlobe,
  "app-server": FaServer,
  microservice: FaMicrochip,
  queue: FaInbox,
  cache: FaBolt,
  "sql-db": FaDatabase,
  "nosql-db": FaDatabase,
  storage: FaHdd,
  _fallback: FaQuestion,
};

export default ICON_MAP;
