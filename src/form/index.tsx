import React, { FC, ReactElement, ReactNode } from 'react';
import {
    FormProps as AntFormProps,
    Form as AntForm,
    Input,
    FormItemProps as AntFormItemProps,
    FormInstance
} from 'antd';
import { css } from '@emotion/css';


interface FormProps<T = any> extends AntFormProps<T> {
    cols?: number;
}

const InternalForm: FC<FormProps> = ({ cols, ...restProps }) => {
    const { children } = restProps;
    /** 采用 Form 的方式进行布局 */
    if (cols && cols > 0 && children instanceof Array) {
        const rows: ReactElement[] = [];
        let cell: ReactElement[] = [];

        let before: number = 0
        children.forEach((element, index) => {
            const { colSpan, rowSpan, br } = element.props;
            const { key } = element

            before +=  (colSpan || 0) + 1

            cell.push(
                <td key={`td-${key}-${index}`} colSpan={colSpan} rowSpan={rowSpan}>
                    {element}
                </td>,
            );

            const remainder = before % cols
            if (br) {
                before += cols - remainder
                cell.push(
                    <td key={`td-${key}-${index}-br`} colSpan={cols - remainder}>
                    </td>
                )
            }

            if (
                before >= cols
            ) {
                rows.push(<tr key={`tr-${key}-${index}`}>{cell}</tr>);
                cell = [];
                before = 0;
            }
        });

        const lastKey = children[children.length - 1].key;
        rows.push(<tr key={`tr-${lastKey}`}>{cell}</tr>);
        return (
            <AntForm {...restProps}>
                <table
                    className={css`
                        width: 100%;
                        table-layout: fixed;
                        td {
                            padding-left: .5rem;
                        }
                        .ant-form-item {
                            margin: 0 0 1em;
                        }
                    `}
                >
                    <tbody>{rows}</tbody>
                </table>
            </AntForm>
        );
    }

    /** 采用默认的 antd 方式 */
    return <AntForm {...restProps} />;
};


interface FormItemProps extends AntFormItemProps {
    colSpan?: number;
    rowSpan?: number;
    br?: boolean;
}

const FormItem: FC<FormItemProps> = (props) => {
    return <AntForm.Item {...props} />;
};

type JSONFormsDataFieldRule = {
    len?: number;
    max?: number;
    message?: string;
    min?: number;
    pattern?: string;
    required?: boolean;
}

type JSONFormsDataField = {

    /** 配合 label 属性使用，表示是否显示 label 后面的冒号 */
    colon?: boolean

    /** 设置依赖字段 */
    dependencies?: string[]

    /** 是否隐藏字段 */
    hidden?: boolean

    /** label 标签的文本 */
    label: string

    /** label 标签的文本对齐方式 */
    labelAlign?: 'left' | 'right'

    /** name 字段名称 */
    name: string

    /** 校验规则，设置字段的校验逻辑 */
    rules?: JSONFormsDataFieldRule[]

    /** 下一个是否强制换行 */
    br?: boolean

    /** 编辑器 */
    editor?: string
}

export type JSONFormsData = {
    /** 一行显示多少列 */
    cols?: number

    /** label 标签的文本对齐方式 */
    labelAlign?: 'left' | 'right'

    /** label 标签的文本换行方式 */
    labelWrap?: boolean

    /** 表单默认值，只有初始化以及重置时生效 */
    initialValues?: object

    /** 当字段被删除时保留字段值 */
    preserve?: boolean

    /** 提交失败自动滚动到第一个错误字段 */
    scrollToFirstError?: boolean

    /** 实际的字段信息 */
    fields: JSONFormsDataField[]
}

type ExtendEditors = {
    name: string
    editor: ReactNode
}

interface JSONFormsProps {
    data: JSONFormsData,
    form?: FormInstance<any>
    extendEditors?: ExtendEditors[]
}

const JSONForm = ({
    data,
    form,
    extendEditors = []
}: JSONFormsProps) => {
    debugger
    const getFormItemEditor = (editor?: string) => {
        
        let edit = extendEditors?.find(ele => ele.name === editor)
        if (edit === undefined) {
            return <Input />
        }
        return edit;
    }

    return (
        <InternalForm
            cols={data?.cols}
            form={form}
            labelAlign={data?.labelAlign}
            labelWrap={data?.labelWrap}
            initialValues={data?.initialValues}
            preserve={data?.preserve}
            scrollToFirstError={data?.scrollToFirstError}
        >
            {data?.fields.map(field => (
                <FormItem
                    colon={field.colon}
                    dependencies={field.dependencies}
                    hidden={field.hidden}
                    label={field.label}
                    labelAlign={field.labelAlign}
                    name={field.name}
                    rules={field.rules as any}
                    br={field.br}
                    key={field.name}

                >
                    {getFormItemEditor(field?.editor)}
                </FormItem>
            ))}
        </InternalForm>
    )
}


type InternalFormType = typeof InternalForm;

interface FormInterface extends InternalFormType {
    useForm: typeof AntForm.useForm;
    Item: typeof FormItem;
    List: typeof AntForm.List;
    ErrorList: typeof AntForm.ErrorList;
    Provider: typeof AntForm.Provider;
    JSONForm: typeof JSONForm;
}

const Form = InternalForm as FormInterface;

Form.useForm = AntForm.useForm;
Form.Item = FormItem;
Form.List = AntForm.List;
Form.ErrorList = AntForm.ErrorList;
Form.Provider = AntForm.Provider;
Form.JSONForm = JSONForm

export default Form;
