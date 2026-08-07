import EqualizerIcon from '@mui/icons-material/Equalizer';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import GroupsIcon from '@mui/icons-material/Groups';
import StorefrontIcon from '@mui/icons-material/Storefront';
import CalculateIcon from '@mui/icons-material/Calculate';
import PrecisionManufacturingIcon from '@mui/icons-material/PrecisionManufacturing';
import FolderSpecialIcon from '@mui/icons-material/FolderSpecial';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import CategoryIcon from '@mui/icons-material/Category';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import ConstructionIcon from '@mui/icons-material/Construction';
import EngineeringIcon from '@mui/icons-material/Engineering';
import BusinessIcon from '@mui/icons-material/Business';
import HandymanIcon from '@mui/icons-material/Handyman';
import SentimentSatisfiedAltIcon from '@mui/icons-material/SentimentSatisfiedAlt';



export const defaultIcons = {
  'equalizer'               : EqualizerIcon,
  'account-balance'         : AccountBalanceIcon,
  'auto-fix-high'           : AutoFixHighIcon,
  'groups'                  : GroupsIcon,
  'storefront'              : StorefrontIcon,
  'calculate'               : CalculateIcon,
  'precision-manufacturing' : PrecisionManufacturingIcon,
  'folder-special'          : FolderSpecialIcon,
  'support-agent'           : SupportAgentIcon,
  'group-add'               : GroupAddIcon,
  'category'                : CategoryIcon,
  'local-shipping'          : LocalShippingIcon,
  'construction'            : ConstructionIcon,
  'handyman'                : HandymanIcon,
  'engineering'             : EngineeringIcon,
  'business'                : BusinessIcon,
  'sentiment-satisfied-alt' : SentimentSatisfiedAltIcon,
};

export type DefaultIconId = keyof typeof defaultIcons
