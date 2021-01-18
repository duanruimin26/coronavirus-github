import mockData from '../../test/mockdata';
import Mock from 'mockjs';

const mockStart = ()=>{
    Object.keys(mockData).forEach(key => {
        Mock.mock(new RegExp(`${key}`), mockData[key])
    })
}

export default mockStart;
