import './CategoriesList.css'
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppState } from '../../redux/app-state';
import { useNavigate } from 'react-router-dom';
import { ActionType } from '../../redux/action-type';
import { ICategory } from '../../models/ICategory';
import axios from 'axios';

function CategoriesList() {

    let dispatch = useDispatch();
    let navigate = useNavigate();

    let [categories, setCategories] = useState<ICategory[]>(useSelector<AppState, ICategory[]>((state: AppState) => state.categories))

    let [isLoading, setIsLoading] = useState(true);
    let [currentPage, setCurrentPage] = useState<number>(1);
    let [totalPages, setTotalPages] = useState<number>(1);

    useEffect(() => {
        getCategories();
        setIsLoading(false);
    }, [currentPage]);

    async function getCategories() {
        try {
            let responseCategories = await axios.get(`http://localhost:8080/categories/byPage?page=${currentPage}`);
            let { categories, totalPages } = responseCategories.data;
            setCategories(categories);
            setTotalPages(totalPages || 0);
            setCurrentPage((currentPage) => Math.max(1, Math.min(currentPage, totalPages)));
            navigate(`?page=${currentPage}`);
        } catch (error: any) {
            console.error("Error fetching categories:", error);
            setIsLoading(false)
        }
    }


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
            <button onClick={() => setCurrentPage((prevPage) => Math.max(1, prevPage - 1))}>Previous Page</button>
            {currentPage} of {totalPages}
            <button onClick={() => setCurrentPage((prevPage) => Math.min(totalPages, prevPage + 1))}>Next Page</button>

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
