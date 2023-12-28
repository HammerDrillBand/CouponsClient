import React, { useEffect, useState } from 'react';
import './CategoryEditor.css';
import { useDispatch, useSelector } from 'react-redux';
import { AppState } from '../../redux/app-state';
import axios from 'axios';
import { ActionType } from '../../redux/action-type';
import { useNavigate } from 'react-router-dom';
import jwt_decode from 'jwt-decode'
import { ICategory } from '../../models/ICategory';

function CategoryEditor() {

    let dispatch = useDispatch();
    let navigate = useNavigate();

    let category: ICategory = useSelector((state: AppState) => state.editedCategory);
    let [isChangesMade, setIsChangesMade] = useState<boolean>(false);

    useEffect(() => {
        dispatch({ type: ActionType.resetEditedCategory })
        setIsLoading(false);
    }, []);

    let [formData, setFormData] = useState<ICategory>({
        id: category.id,
        name: category.name
    });

    let [isLoading, setIsLoading] = useState(true);
    let isNewCategory: boolean = formData.id == -1;

    if (isLoading) {
        return <div>Loading...</div>;
    }

    function inputChanged(event: any) {
        let { name, value } = event.target;
        setFormData({
            ...formData,
            [name]: value,
        });
        setIsChangesMade(true);
    };

    async function onSaveChangesClicked() {
        try {
            if (isNewCategory) {
                await axios.post(`http://localhost:8080/categories`, formData);
            } else {
                await axios.put(`http://localhost:8080/categories`, formData);
            }

            updateCategoriesState();

            if (isNewCategory) {
                alert("Category created successfully");
            } else {
                alert("Category updated successfully");
            }
            navigate(`/categories`);
        } catch (error: any) {
            alert(error.response.data.errorMessage);
        }
    };

    async function onDeleteClicked() {
        try {
            await axios.delete(`http://localhost:8080/categories/${formData.id}`);

            updateCategoriesState();

            alert("Category deleted successfully");
            navigate(`/categories`);
        } catch (error: any) {
            alert(error.response.data.errorMessage);
        };
    };

    async function updateCategoriesState() {
        let responseCategories = await axios.get(`http://localhost:8080/categories`);
        let categories: ICategory[] = responseCategories.data;
        dispatch({ type: ActionType.UpdateCategories, payload: { categories } });
    };

    function getUserType(): string | null {
        let storedToken = localStorage.getItem('authToken');
        if (storedToken) {
            axios.defaults.headers.common['Authorization'] = storedToken;
            let decodedToken: any = jwt_decode(storedToken);
            let decodedTokenData = JSON.parse(decodedToken.sub);
            let userTypeFromToken = decodedTokenData.userType;
            return userTypeFromToken;
        }
        return null;
    };


    return (
        <div className='CategoryEditor'>
            {getUserType() == 'ADMIN' ? (
                <>
                    {!isNewCategory && (
                        <div className='EditorLineItem'>
                            <label className='Label'>Category #: {formData.id}</label>
                        </div>
                    )}
                    <div className='EditorLineItem'>
                        <label className='Label'>Name:</label>
                        <input
                            className='EditorInput'
                            type='text'
                            id='name'
                            name='name'
                            value={formData.name}
                            onChange={inputChanged}
                        />
                    </div>
                    <div className='ButtonContainer'>
                        <button
                            className={`${isChangesMade ? 'SaveButton' : 'disabled-button'}`}
                            onClick={onSaveChangesClicked}
                            disabled={!isChangesMade}>
                            Save Changes
                        </button>
                        {!isNewCategory && (
                            <button
                                className='DeleteButton'
                                onClick={onDeleteClicked}>
                                Delete This Category
                            </button>
                        )}
                    </div>
                </>
            ) : (
                <div>Why are you even here?!</div>
            )}
        </div>
    );
}

export default CategoryEditor;
