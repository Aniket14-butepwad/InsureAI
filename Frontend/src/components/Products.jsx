import { useNavigate } from 'react-router-dom';
import {
  FaHeartbeat,
  FaCarCrash,
  FaHome,
  FaPlane,
  FaUserShield,
  FaMotorcycle
} from "react-icons/fa";

// Each card maps to the policyType used in the backend
const PRODUCTS = [
  { icon: <FaHeartbeat className="product-icon" />, label: 'Health Insurance',   type: 'HEALTH'      },
  { icon: <FaCarCrash  className="product-icon" />, label: 'Car Insurance',      type: 'MOTOR'       },
  { icon: <FaUserShield className="product-icon"/>, label: 'Life Insurance',     type: 'LIFE'        },
  { icon: <FaMotorcycle className="product-icon"/>, label: 'Bike Insurance',     type: 'TWO_WHEELER' },
  { icon: <FaHome      className="product-icon" />, label: 'Home Insurance',     type: 'HOME'        },
  { icon: <FaPlane     className="product-icon" />, label: 'Travel Insurance',   type: 'TRAVEL'      },
];

function Products() {
  const navigate = useNavigate();

  return (
    <section className="products">
      <h2>Our Insurance Products</h2>

      <div className="product-grid">
        {PRODUCTS.map(({ icon, label, type }) => (
          <div
            key={type}
            className="product-card"
            onClick={() => navigate(`/view-plans/${type}`)}
            style={{ cursor: 'pointer' }}
          >
            {icon}
            <h3>{label}</h3>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Products;

