import './CategoriesList.css'
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppState } from '../../redux/app-state';
import { useNavigate } from 'react-router-dom';
import { ActionType } from '../../redux/action-type';
import { ICategory } from '../../models/ICategory';

function CategoriesList() {

    let dispatch = useDispatch();
    let navigate = useNavigate();

    let categories: ICategory[] = useSelector<AppState, ICategory[]>((state: AppState) => state.categories);
    let [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setIsLoading(false)
    }, []);


    if (isLoading) {
        return <div>Loading...</div>;
    };

    function onEditClicked(id: number) {
        let editedCategory: ICategory | undefined = categories.find(category => category.id === id);
        dispatch({ type: ActionType.EditCategory, payload: { editedCategory } });
        navigate(`/category_editor?categoryId=${id}`);
    };

    return (
        <div className="CategoriesList">
            <table>
                <thead>
                    <tr>
                        <td>ID</td>
                        <td>Name</td>
                        <td>Edit</td>
                    </tr>
                </thead>
                <tbody>
                    {categories.length > 0 ? (
                        categories.map((category) => (
                            <tr key={category.id}>
                                <td>{category.id}</td>
                                <td>{category.name}</td>
                                <td><button onClick={() => onEditClicked(category.id)}>Edit</button></td>
                            </tr>
                        ))
                    ) : (
                        <p>No categories available</p>
                    )}
                </tbody>
            </table>
        </div>
    );
}

export default CategoriesList;
