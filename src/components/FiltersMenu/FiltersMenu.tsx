import { useDispatch, useSelector } from 'react-redux';
import './FiltersMenu.css'
import { AppState } from '../../redux/app-state';
import { useState } from 'react';
import { ActionType } from '../../redux/action-type';


function FiltersMenu() {

    let dispatch = useDispatch();
    debugger;
    let categories = useSelector((state: AppState) => state.categories);

    let [selectedCategories, setSelectedCategories] = useState<number[]>(categories.map(category => category.id));

    function categorySelectionChanged(categoryId: number) {
        let updatedSelectedCategories = selectedCategories.includes(categoryId)
            ? selectedCategories.filter(option => option !== categoryId)
            : [...selectedCategories, categoryId];

        setSelectedCategories(updatedSelectedCategories);
        dispatch({ type: ActionType.FilterByCategoryIds, payload: { selectedCategories: updatedSelectedCategories } });
    };

    return (
        <div>
            <h2>Select Category</h2>
            {categories.map(category => (
                <div key={category.id}>
                    <label>
                        <input
                            type="checkbox" value={category.name}
                            checked={selectedCategories.includes(category.id)}
                            onChange={() => categorySelectionChanged(category.id)}
                        />
                        {category.name}
                    </label>
                </div>
            ))}
            <p>Selected options: {selectedCategories.join(', ')}</p>
        </div>
    );
};

export default FiltersMenu;

