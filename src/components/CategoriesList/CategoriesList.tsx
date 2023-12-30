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

    let searchText: string = useSelector<AppState, string>((state: AppState) => state.searchText);

    let [categories, setCategories] = useState<ICategory[]>(useSelector<AppState, ICategory[]>((state: AppState) => state.categories))
    let [isLoading, setIsLoading] = useState(true);
    let [currentPage, setCurrentPage] = useState<number>(1);
    let [totalPages, setTotalPages] = useState<number>(1);

    useEffect(() => {
        getCategories();
        setIsLoading(false);
    }, [currentPage, searchText]);

    if (isLoading) {
        return <div>Loading...</div>;
    };

    async function getCategories() {
        try {
            let responseCategories = await axios.get(`http://localhost:8080/categories/byFilters?page=${currentPage}
            &searchText=${searchText}`);

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

    function onEditClicked(id: number) {
        let editedCategory: ICategory | undefined = categories.find(category => category.id === id);
        dispatch({ type: ActionType.EditCategory, payload: { editedCategory } });
        navigate(`/category_editor?categoryId=${id}`);
    };

    return (
        <div className="CategoriesList">
            <div className='Pages'>
                <button
                    onClick={() => setCurrentPage((prevPage) => Math.max(1, prevPage - 1))}
                    className={`${currentPage == 1 ? 'DisabledPageButton' : 'PageButton'}`}
                    disabled={currentPage == 1}>
                    ◄
                </button>
                Page {currentPage} of {totalPages}
                <button
                    onClick={() => setCurrentPage((prevPage) => Math.min(totalPages, prevPage + 1))}
                    className={`${currentPage == totalPages ? 'DisabledPageButton' : 'PageButton'}`}
                    disabled={currentPage == totalPages}>
                    ►
                </button>
            </div>

            <table>
                <thead>
                    <tr>
                        <td>ID</td>
                        <td>Name</td>
                        <td></td>
                    </tr>
                </thead>
                <tbody>
                    {categories.length > 0 ? (
                        categories.map((category) => (
                            <tr key={category.id}>
                                <td>{category.id}</td>
                                <td>{category.name}</td>
                                <td><button
                                    className='EditButton'
                                    onClick={() => onEditClicked(category.id)}>
                                    Edit
                                </button></td>
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
