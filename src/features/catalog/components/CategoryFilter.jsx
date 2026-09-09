import { useRefinementList } from 'react-instantsearch';

const CategoryFilter = ({ attribute }) => {
  const { items, refine } = useRefinementList({ attribute });

  return (
    <ul className="category-list">
      {items.map((item) => (
        <li key={item.label}>
          <label>
            <input
              type="checkbox"
              checked={item.isRefined}
              onChange={() => refine(item.value)}
            />
            {item.label} <span className="count">({item.count})</span>
          </label>
        </li>
      ))}
    </ul>
  );
};

export default CategoryFilter;